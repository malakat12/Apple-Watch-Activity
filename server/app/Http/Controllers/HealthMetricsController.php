<?php

namespace App\Http\Controllers;

use Validator;
use App\Models\HealthMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use League\Csv\Reader;
use Carbon\Carbon;

class HealthMetricsController extends Controller
{
        public function upload(Request $request)
        {
            set_time_limit(300); 
            $request->validate([
                'file' => 'required|file|mimes:csv,txt|max:10240',
            ]);
            $file = $request->file('file');
            $user = Auth::user();
            
            $csv = Reader::createFromPath($file->getRealPath(), 'r');
            $csv->setHeaderOffset(0);
            
            $records = $csv->getRecords();
            $importedCount = 0;
            $batchSize = 100; 
            $batch = [];
            
            foreach ($records as $record) {
                if (!isset($record['date']) || !isset($record['steps']) || 
                    !isset($record['distance_km']) || !isset($record['active_minutes'])) {
                    continue;
                }
                
                $batch[] = [
                    'user_id' => $record['user_id'],
                    'date' => $record['date'],
                    'steps' => (int)$record['steps'],
                    'distance' => (float)$record['distance_km'],
                    'active_minutes' => (int)$record['active_minutes'],
                    'created_at' => now(),
                    'updated_at' => now()
                ];
                
                if (count($batch) >= $batchSize) {
                    HealthMetric::insert($batch);
                    $importedCount += count($batch);
                    $batch = [];
                }
            }
            
            if (!empty($batch)) {
                HealthMetric::insert($batch);
                $importedCount += count($batch);
            }
            
            return response()->json([
                'message' => 'File uploaded successfully',
                'imported_records' => $importedCount
            ]);
        }

        public function getDailyMetrics(Request $request)
        {
            $user = Auth::user();
            $days = $request->input('days', 30);
            
            $metrics = HealthMetric::where('user_id', $user->id)
                ->where('date', '>=', now()->subDays($days))
                ->orderBy('date')
                ->get();
            
            return response()->json([
                'dates' => $metrics->pluck('date')->map(function($date) {
                    return is_string($date) ? $date : $date->format('Y-m-d');
                }),                
                'steps' => $metrics->pluck('steps'),
                'distance' => $metrics->pluck('distance_km'),
                'active_minutes' => $metrics->pluck('active_minutes')
            ]);
        }

        public function getWeeklyMetrics(Request $request)
        {
            $user = Auth::user();
            $weeks = $request->input('weeks', 12); 
            
            $weeklyData = HealthMetric::where('user_id', $user->id)
                ->where('date', '>=', now()->subWeeks($weeks))
                ->get()
                ->groupBy(function($item) {
                    $date = is_string($item->date) 
                        ? \Carbon\Carbon::parse($item->date)
                        : $item->date;
                        
                    return $date->startOfWeek()->format('Y-m-d');
                })
                ->map(function($weekMetrics) {
                    return [
                        'steps' => $weekMetrics->sum('steps'),
                        'distance' => $weekMetrics->sum('distance_km'),
                        'active_minutes' => $weekMetrics->sum('active_minutes'),
                        'days_recorded' => $weekMetrics->count()
                    ];
                });
            
            return response()->json([
                'weeks' => $weeklyData->keys(),
                'steps' => $weeklyData->pluck('steps'),
                'distance' => $weeklyData->pluck('distance'),
                'active_minutes' => $weeklyData->pluck('active_minutes'),
                'days_recorded' => $weeklyData->pluck('days_recorded')
            ]);
        }
}
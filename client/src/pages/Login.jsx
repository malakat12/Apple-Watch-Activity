import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../features/authSlice';
import "./login.css";
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    setLocalError('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      setLocalError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(from, { replace: true });
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {(localError || error) && (
        <div style={styles.errorMessage}>{localError || error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password:</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.toggleButton}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading || !email || !password}
          style={styles.submitButton}
        >
          {loading ? 'loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};




export default Login;
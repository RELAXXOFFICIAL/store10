import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from '../AuthForm';

describe('AuthForm', () => {
  const mockOnLogin = jest.fn();
  const mockOnRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<AuthForm onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('switches to register form when register button is clicked', () => {
    render(<AuthForm onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    fireEvent.click(screen.getByText('Register'));
    
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
  });
});
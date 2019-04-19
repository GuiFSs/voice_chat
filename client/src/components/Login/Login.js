import React, { Component, Fragment } from 'react';
import './Login.css';
import { Button, TextField } from '@material-ui/core';

class Login extends Component {
  state = {
    username: '',
    password: '',
    btnText: 'LOGIN',
    confirmPassword: '',
    showConfirmPassField: false,
    confirmPassError: false,
    smallText: 'ou cadastre-se'
  };

  handleInputChange = (name, value) => {
    const {
      showConfirmPassField,
      confirmPassError,
      password,
      confirmPassword
    } = this.state;
    let showError = confirmPassError;
    if (showConfirmPassField) {
      if (name === 'confirmPassword') {
        if (value !== password) {
          showError = true;
        } else {
          showError = false;
        }
      } else if (name === 'password') {
        if (value !== confirmPassword) {
          showError = true;
        } else {
          showError = false;
        }
      }
    }
    this.setState({ [name]: value, confirmPassError: showError });
  };

  onClickSmallBtn = () => {
    if (this.state.showConfirmPassField) {
      this.setFormType('login');
    } else {
      this.setFormType('cadastro');
    }
  };

  /**
   * params: type = 'login' || 'cadastro'
   */
  setFormType = type => {
    let showConfirmPassField, btnText, smallText;
    if (type === 'login') {
      showConfirmPassField = false;
      btnText = 'LOGIN';
      smallText = 'ou cadastre-se';
    } else {
      showConfirmPassField = true;
      btnText = 'CADASTRAR';
      smallText = 'faça login';
    }
    this.setState({ showConfirmPassField, btnText, smallText });
  };

  onClickMainBtn = () => {
    const { btnText, username, password } = this.state;

    if (username.length < 2 || password.length < 2) {
      window.alert('min 2 length plz!!');
      return;
    }

    if (btnText.toLowerCase() === 'cadastrar') {
      this.setFormType('login');
    }

    this.props.login(btnText.toLowerCase(), { username, password });
  };

  render() {
    const {
      username,
      password,
      btnText,
      confirmPassword,
      showConfirmPassField,
      confirmPassError,
      smallText
    } = this.state;
    return (
      <div id='login-div'>
        <TextField
          fullWidth
          variant='outlined'
          label='Username'
          placeholder='min length: 2'
          required
          autoFocus
          id='username'
          name='username'
          value={username}
          onChange={e => this.handleInputChange(e.target.name, e.target.value)}
        />
        <br />
        <br />
        <TextField
          fullWidth
          variant='outlined'
          label='Password'
          placeholder='min length: 2'
          required
          type='password'
          id='password'
          name='password'
          value={password}
          onChange={e => this.handleInputChange(e.target.name, e.target.value)}
        />
        <br />
        <br />
        {showConfirmPassField && (
          <Fragment>
            <TextField
              error={confirmPassError}
              fullWidth
              variant='outlined'
              label='Confirm Password'
              required
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={confirmPassword}
              onChange={e =>
                this.handleInputChange(e.target.name, e.target.value)
              }
            />
            <br />
            <br />
          </Fragment>
        )}

        <Button
          disabled={btnText.toLowerCase() === 'cadastrar' && confirmPassError}
          fullWidth
          variant='contained'
          color='primary'
          onClick={this.onClickMainBtn}
        >
          {btnText}
        </Button>

        <Button
          onClick={this.onClickSmallBtn}
          style={{ float: 'right', marginTop: '5px' }}
          color='default'
          variant='text'
          size='small'
        >
          <small>{smallText}</small>
        </Button>
      </div>
    );
  }
}

export default Login;

import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from "react-redux";
import { loginUser } from '../actions';
import history from './history';

class Login extends React.Component {
    renderError({ error, touched }) {
        if (touched && error) {
            return (
                <div className="ui error message">
                    <div className="header">{error}</div>
                </div>
            );
        }
    }

    renderInput = ({ input, label, meta }) => {
        const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
        return (
            <div className={className}>
                <label>{label}</label>
                <input {...input} autoComplete="off" />
                {this.renderError(meta)}
            </div>
        );
    };
    renderpassword = ({ input, label, meta }) => {
        console.log("meta = " + JSON.stringify(meta))
        const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
        return (
            <div className={className}>
                <label>{label}</label>
                <input {...input} type="password" autoComplete="off" />
                {this.renderError(meta)}
            </div>
        );
    };

    onSubmit = (formValues) => {
      this.props.loginUser(formValues);
    }

    render() {
        return (
            <form
                onSubmit={this.props.handleSubmit(this.onSubmit)}
                className="ui form error"
            >
                <Field name="number" component={this.renderInput} label="Mobile Number" />

                <Field
                    name="password"
                    component={this.renderpassword}
                    label="Password"
                />
                <button className="ui button primary" >Login</button>
                <button className="ui button primary" onClick={() => { history.push('/register') }} >Register</button>
            </form>
        );
    }
}

const validate = formValues => {
    const errors = {};

    if (!formValues.userId) {
        errors.userId = 'Please enter userId';
    }

    if (!formValues.password) {
        errors.password = 'Password can not be empty';
    }

    return errors;
};

const decoratedComponent = connect(null, { loginUser })(Login);

export default reduxForm({
    form: 'LoginUser',
    validate
})(decoratedComponent);

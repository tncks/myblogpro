import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import '../App.css';

import axios from 'axios';
import { Login } from './index.js';


class header extends Component {
    constructor(props){
        super(props);
        this.state={
            visible: false,
            id: "",
            password: "",
            
            
        }
    }

    

    _openModal = function() {
        return this.props._toggleModal(true);
    }

    _closeModal = function() {
        this.setState({
            visible: false
        });
    }

    _changeID = function() {
        const id_v = document.getElementsByName('id')[0].value;
        
        this.setState({
            id: id_v
        });
    }

    _changePW = function() {
        const pw_v = document.getElementsByName('password')[0].value;
        
        this.setState({
            password: pw_v
        });
    }

    _selectUserData = async (e) => {
        const res = await axios('/send/pw', {
            method: 'POST',
            data : this.state,
            headers: new Headers()
        })

        if(res.data) {
            //console.log(res.data);

            if(res.data.suc) {
                this.props._login(res.data);
                this._closeModal();

                return alert('로그인 되었습니다.');
            } else {
                this.setState({
                    
                    password: ""
                })
                return alert('아이디 혹은 비밀번호가 일치하지 않습니다.')
            }
        }
    }

    _logout = function() {
        if(window.confirm('로그아웃 하시겠습니까?')){
            this.props._logout();
            document.getElementsByName('password')[0].value = "";
            document.getElementsByName('id')[0].value = "";
            this.setState({ id: "", password: ""});
            this.props.history.push('/');
        }
    }

    _check = function() {
        
        
        if(this.props.location.pathname==='/write'){
            this.props.history.push('/');
        }
        else {
            if(document.getElementById('special2')==null||document.getElementById('special')==null) {
                this.props.history.push('/');
            } else {
                document.getElementById('special2').value = '';
                document.getElementById('special').click();
            }
            
        }
        
        
    }

    

    render() {

        const { login, admin, user_ip, login_modal, _toggleModal } = this.props;

        return (
            <div className='header_grid'>
                <div className='acenter'>
                    {login && admin === 'Y' && user_ip === "192.168.43.69"
                    ? <h5 id='tmpp'> <Link to='/write'> 포스트 작성 </Link></h5> : null }
                </div>

                <div className='acenter'>
                    
                    <h3 id='ababhome' onClick={()=> this._check()}>Suchan's blog</h3>
                </div>

                <div className='acenter'>
                    <ul className='btn_list'>
                    {login ? <li className='btn_cursor' onClick={() => this._logout()}> 로그아웃 </li> : <li className='btn_cursor' onClick={() => this._openModal()}> 로그인 </li> }
                    <Login
                      _login = {this.props._login}
                      login_modal = {login_modal}
                      _toggleModal = {_toggleModal}
                    />

                    {!login
                    ? <li><Link to='/signup'> 회원가입 </Link></li>
                    : null
                    }
                    
                    </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(header);
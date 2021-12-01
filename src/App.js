import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Route, Link, Switch } from 'react-router-dom';
import { Head } from './inc';
import { Main } from './page/index.js';
import queryString from 'query-string';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login : false,
      admin : false,
      user_ip : "",
      signup : false,
      login_modal : false,
      list_data : [],
      list_page : 1,
      list_limit : 10,
      list_all_page : [],
      list_search : "",
      category : "",
      user_id : "",
      data : "",
      date : "",
      like_num : ""
    }
  }

  componentDidMount() {
    this._getListData();
    
    if(sessionStorage.login && sessionStorage.IP) {
      this.setState({ 
        login: JSON.parse(sessionStorage.login).id,
        admin : JSON.parse(sessionStorage.login).admin,
        user_ip : JSON.parse(sessionStorage.IP),
        user_id : JSON.parse(sessionStorage.login).user_id,
       })
    }
  }

  _changeCategory = (target) => {
    sessionStorage.setItem('category', target);
    this.setState({ category : target });

    return this._getListData();
  }

  _setPage = function() {
    if(sessionStorage.page) {
      this.setState({ list_page : Number(sessionStorage.page) })
      return Number(sessionStorage.page);
    }

    this.setState({ list_page : 1 })
    return 1;
  }

_changePage = (el) => {
    this.setState({ list_page : el })
    sessionStorage.setItem('page', el);

    return this._getListData();
}

_getListData = async function() {
  const { list_limit } = this.state;
  const list_pages = this._setPage();

  let categorys = '';
  if(sessionStorage.getItem('category')) {
    categorys = sessionStorage.getItem('category')
  }

  let search = "";
  if(queryString.parse(this.props.location.search)) {
    search = queryString.parse(this.props.location.search).search;
  }

  // Board 테이블 데이터 전체 수
  const total_cnt = await axios('/get/board_cnt', {
    method : 'POST',
    headers: new Headers(),
    data : { search : search, category : categorys }
  });

  // 데이터 가져오기
  const total_list = await axios('/get/board', {
    method : 'POST',
    headers: new Headers(),
    data : { 
      limit : list_limit, 
      page : list_pages, 
      search : search, 
      category : categorys }
})

// 전체 페이지 수 구하기
let page_arr = [];

for(let i = 1; i <= Math.ceil(total_cnt.data.cnt / list_limit); i++) {
  page_arr.push(i);
}

this.setState({ list_data : JSON.stringify(total_list.data), 
                list_all_page : page_arr, 
                list_search : search })
}

  _login = (data) => {
      sessionStorage.setItem('login', JSON.stringify(data.suc))
      sessionStorage.setItem('IP', JSON.stringify(data.ip))

      this.setState({ login : JSON.parse(sessionStorage.login).id,  
                 admin : JSON.stringify(data.suc).admin,
                  user_ip : JSON.parse(sessionStorage.IP),
                 user_id : JSON.parse(sessionStorage.login).user_id
      })

      return window.location.reload();
  }

  _logout = () => {
    this.setState({ login : false, admin: false, user_ip : "" })
    sessionStorage.removeItem('login')
    sessionStorage.removeItem('IP')
  }

  _getData = async (board_id) => {
        

    const getData = await axios('/get/board_data', {
        method: 'POST',
        headers: new Headers(),
        data : { id : board_id }
    });

    
    
    //this._getLikeInfo();

    return this.setState({ data : getData });
}

_getAllLike = (type) => {
    const { data } = this.state;

    if(type==='add') {
        ;
    } else if(type==='remove') {
        ;
    }
}

  _addData = async(e) => {
    const { name } = this.state;
    e.preventDefault();
    
    const res = await axios('/add/data', {
      method : 'POST',
      data : { 'data' : name },
      headers: new Headers()
    })

    if(res.data) {
      alert('데이터를 추가했습니다.');
      return window.location.reload();
    }
  }

  _nameUpdate(e) {
    this.setState({ name : e.target.value })
  }

  _getDataold = async () => {
    const res = await axios.get('/get/data');

    if(res.data[0] === undefined) {
      let cover = [];
      cover.push(res.data);

      return this.setState({ list : cover })
    }
    this.setState({ list : res.data });
  }

  _modify = async (el) => {
    const modify = prompt(el.name + '을 어떤 이름으로 변경할까요?');

    if(modify !== null) {
      const body = {
        name : modify,
        id : el.id
      }

      const res = await axios('/modify/data', {
        method: 'POST',
        data : { 'modify': body},
        headers: new Headers()
      })

      if(res.data) {
        alert('데이터를 수정했습니다.');
        return window.location.reload();
      }
    }
  }

  _delete = async(el) => {
    const remove = window.confirm(el.name + '을 삭제합니까?');

    if(remove) {
      const body = { id : el.id };
      const res = await axios('/delete/data', {
        method: 'POST',
        data: { 'delete' : body},
        headers: new Headers()
      })

      if(res.data) {
        alert('데이터를 삭제했습니다.');
        return window.location.reload();
      }
    }
  }

  _toggleModal = (boolean) => {
    this.setState({ login_modal : boolean })
  }

  render() {
    
    const { login, admin, user_ip, login_modal,
            list_data, list_all_page, list_search, list_page, user_id, data, date, like_num } = this.state;
    const { _login, _logout, _toggleModal, _getSearch, _changePage, _changeCategory, _getData, _getAllLike } = this;

    return(
      <div>
        <div>
          <Head
          login = { login }
          admin = { admin }
          user_ip = { user_ip }
          _login = { _login }
          _logout = { _logout }
          login_modal = {login_modal}
          _toggleModal = {_toggleModal}
          />
        </div>

        <div>
          <Main
          admin = { admin }
          user_ip = { user_ip }
          login={login}
          login_modal = {login_modal}
          _toggleModal = {_toggleModal}
          _getSearch = {_getSearch}
          list_data = {list_data}
          list_all_page = {list_all_page}
          list_search = {list_search}
          list_page = {list_page}
          _changePage = {_changePage}
          _changeCategory = {_changeCategory}
          user_id = {user_id}
          data = {data}
          date = {date}
          like_num = {like_num}
          _getData = {_getData}
          _getAllLike = {_getAllLike}
          />
        </div>
      </div>
    );
  }
}

export default App;

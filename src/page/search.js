import React, { Component } from 'react';
import './main.css';

class search extends Component {
  constructor(props) {
    super(props)
  }

  render() {
      return (
          <div>
              <form>
                  <input type='text' maxLength='20' id='special2' className='search_input' name='search' placeholder='검색어를 입력해주세요.' />
                  <input type='submit' value='검색' className='search_submit' id='special' />
              </form>
          </div>
      );
  }
}

export default search;
import React, { Component } from 'react';
import './main.css';
import axios from 'axios';


class view extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            none_like : 'https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2013/png/iconmonstr-thumb-10.png&r=171&g=171&b=171',
            like : 'https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2013/png/iconmonstr-thumb-10.png&r=171&g=53&b=53',
            like_exist : false,
            
        }
    }

    componentDidMount() {
        const board_id = this.props.match.params.data;
        if(!this.props.data) {
            this.props._getData(board_id);
        }

        //this._getData(board_id);
        this._addViewCnt(board_id);
        this._getLikeInfo();
    }

    

    _getLikeInfo = async function() {
        const { user_id, login } = this.props;

        if(login) {
            const board_id = this.props.match.params.data;
            const obj = { user_id : user_id, board_id : board_id };

            const getData = await axios('/check/like', {
                method : 'POST',
                headers: new Headers(),
                data : obj
            });
            
            if(getData.data[0]) {
                this.setState({
                    like_exist : true
                })
            } else {
                ;
            }
        }
    }

    _toggleLike = async function() {
        const { user_id, login, _toggleModal, _getData, _getAllLike } = this.props;


        if(!login) {
            return alert('로그인이 필요합니다.');
            
        }

        

        const board_id = this.props.match.params.data;
        const obj = { type : 'add', user_id : user_id, board_id : board_id };

        const res = await axios('/update/like', {
            method: 'POST',
            headers: new Headers(),
            data: obj
        });

        if(!res.data) {
            if(true) {
                const cancel = { type : 'remove', user_id : user_id, board_id : board_id };

                await axios('/update/like', {
                    method: 'POST',
                    headers : new Headers(),
                    data : cancel
                })

                this.setState({ like_exist : false })
                _getAllLike('remove');
            }
        } else {
            this.setState({ like_exist : true});
            _getAllLike('add');

            
        }

        return _getData(board_id);

    }

   

    _addViewCnt = async function(board_id) {
        const addView = await axios('/update/view_cnt', {
            method: 'POST',
            headers: new Headers(),
            data: { id : board_id }
        })
    }

    render() {
        const { none_like, like, like_exist } = this.state;
        
        const { data, date, like_num } = this.props;

        return (
            <div className='Write View'>
                {data.data
                ? <div>

                    <div className='top_title'>
                        <input type='text' id='title_txt' name='title' defaultValue={data.data.data[0].title} readOnly/>

                        <div className='date_div'>
                            {data.data.data[0].date}
                        </div>
                    </div>

                    <div id='contents_div'
                         dangerouslySetInnerHTML={ {__html : data.data.data[0].contents}}
                    >
                        
                    </div>
                    <div className='other_div'>
                        <div> </div>
                        <div className='Like'>
                            <img src={!like_exist ? none_like : like} onClick={() => this._toggleLike()} />
                            <h5> 좋아요 ( {data.data.data[0].likes}개 ) </h5>
                        </div>
                        <div> </div>
                    </div>
                 
                 </div>
                  : null}
            </div>
        );
    }
}

export default view;
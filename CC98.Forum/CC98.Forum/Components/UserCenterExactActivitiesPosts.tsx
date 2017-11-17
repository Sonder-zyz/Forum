﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import { UserCenterExactActivitiesPost } from './UserCenterExactActivitiesPost';
import { UserRecentPost } from '../States/AppState';
import * as Utility from '../Utility';

//用户中心主页帖子动态组件
export class UserCenterExactActivitiesPosts extends React.Component<null, UserCenterExactActivitiesPostsState> {
    constructor(props) {
        super(props);
        //临时填充数据
        this.state = {
            userRecentPosts: [],
            isLoading: false
        };
        this.scrollHandler = this.scrollHandler.bind(this);
    }

    scrollHandler(e) {
        let pageYLeft = document.body.scrollHeight - window.pageYOffset;
        
        if (pageYLeft < 1500 && this.state.isLoading === false) {
            this.setState(async (prevState) => {
                this.setState({isLoading: true});

                const url = `http://apitest.niconi.cc/me/recenttopics?from=${this.state.userRecentPosts.length}&size=10`
                const token = window.localStorage.accessToken.slice(4);

                let res = await fetch(url, {
                    headers: {
                        'Authorization': token
                    }
                });

                let data: itemType[] = await res.json();

                if (data.length < 10) {
                    window.removeEventListener('scroll', this.scrollHandler);
                }

                let posts = prevState.userRecentPosts;
                let i = data.length;

                while (i--) {
                    let post = await this.item2post(data[i]);
                    posts.push(post);
                }

                this.setState( {
                    userRecentPosts: posts,
                    isLoading: false
                });
            });
        }
    }

    async componentDidMount() {
        const url = `http://apitest.niconi.cc/me/recenttopics?from=0&size=10`
        const token = window.localStorage.accessToken.slice(4);
        let res = await fetch(url, {
            headers: {
                'Authorization': token
            }
        });
        let data = await res.json();

        console.log(data);

        let posts: UserRecentPost[] = [],
            i = data.length;

        while (i--) {
            let post = await this.item2post(data[i]);
            posts.unshift(post);
        }

        this.setState({
            userRecentPosts: posts
        });
        if (data.length === 10) {
            window.addEventListener('scroll', this.scrollHandler);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollHandler);
    }

    async item2post(item: itemType) {
        let userRecentPost = new UserRecentPost();
        userRecentPost.approval = item.likeCount;
        userRecentPost.board = await Utility.getBoardName(item.boardId);
        userRecentPost.date = item.time.replace('T', ' ').slice(0,19);
        userRecentPost.disapproval = item.dislikeCount;
        userRecentPost.content = item.title;
        userRecentPost.id = item.id;
        userRecentPost.boardId = item.boardId;
        userRecentPost.name = item.userName;
        userRecentPost.isAnonymous = item.isAnonymous;

        return userRecentPost;
    }

    render() {
        //console.log(this.state.userRecentPosts);
        if (!this.state.userRecentPosts) {
            return (
                <div className="user-posts">
                    没有主题
                </div>
            );
        }

        //state转换为JSX
        const userRecentPosts = this.state.userRecentPosts.map((item) => (<UserCenterExactActivitiesPost userRecentPost={item} />));
        //添加分隔线
        for (let i = 1; i < userRecentPosts.length; i += 2) {
            userRecentPosts.splice(i, 0, <hr />);
        }
        return (
            <div className="user-posts">
                {userRecentPosts}
            </div>
        );
    }
}

interface UserCenterExactActivitiesPostsState {
    userRecentPosts: UserRecentPost[];
    isLoading: boolean;
}

//临时填充数据
interface itemType {
    boardId: number;
    dislikeCount: number;
    likeCount: number;
    title: string;
    id: number;
    time: string;
    userName: string;
    isAnonymous: boolean;
}
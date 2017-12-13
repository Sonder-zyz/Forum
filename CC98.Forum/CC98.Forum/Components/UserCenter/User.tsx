﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from 'react';
import {
    BrowserRouter as Router,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { UserNavigation } from './UserNavigation';
import { UserRouter } from './UserRouter';
import { NotFoundUser } from '../Status';

class UserBeforeConnent extends React.Component<{isError}> {
    render() {
        if (this.props.isError) {
            return <NotFoundUser />;
        }
        return (<div className="user-center">
            <div className="user-center-content">
                <div className="user-center-head">
                    <p>用户详情</p>
                </div>
                <div className="user-center-body">
                    <UserNavigation />
                    <UserRouter />
                </div>
            </div>
        </div>);
    }
}

function mapState(state) {
    return {
        isError: !state.userInfo.currentVisitingUserIsExisted
    };
}

export const User = connect(mapState, null)(UserBeforeConnent);
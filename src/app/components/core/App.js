import React, { useState, useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';

// import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppRouter from 'app/routes/AppRouter';
import {
  ConfirmModal,
  ForwardModal,
  InfoModal,
  TreeFolderModal,
  ErrorModal,
} from 'app/components/shared';

import store from 'app/store';

const StyledToastContainer = styled(ToastContainer)`
  > div {
    border-radius: 0.25rem !important;
  }
  * {
    font-family: Barlow !important;
    font-size: 20px;
  }
`;

const initialSignalRConnection = () =>
  // token,
  // connectSignalR
  {
    // console.log('🔗🔗🔗 Initial hub connection...');
    // const con = new HubConnectionBuilder()
    //   .withUrl('http://202.78.227.176:32653/notificationHub', {
    //     accessTokenFactory: () => token.access_token,
    //   })
    //   .configureLogging(LogLevel.Information)
    //   .build();
    // con.on('Notify', (message) => {
    //   console.log(message);
    // });
    // con.on('Ping', (message) => {
    //   console.log(message);
    // });
    // // reconnect
    // con.onclose(async () => {
    //   await connectSignalR();
    // });
    // return con;
  };

const App = () => {
  const [connection, setConnection] = useState(null);

  const connectSignalR = useCallback(async () => {
    if (connection && connection.connectionState === 0) {
      try {
        console.log('🚀🚀🚀 Connecting to hub...');
        await connection.start();
      } catch (error) {
        console.log(error);
      }
    }
  }, [connection]);

  const disconnectSignalR = useCallback(async () => {
    if (connection && connection.connectionState === 1) {
      try {
        await connection.stop();
        console.log('🛑🛑🛑 Stoped hub connection!');
      } catch (error) {
        console.log(error);
      }
    }
  }, [connection]);

  // const { token } = useSelector((state) => state.auth);
  const token = { access_token: process.env.REACT_APP_SIGNAL_R_TOKEN };
  useEffect(() => {
    if (token && !connection) {
      const con = initialSignalRConnection(token, connectSignalR);
      setConnection(con);
    }
    if (token && connection) {
      connectSignalR();
    }
    return disconnectSignalR;
  }, [token, connection, connectSignalR, disconnectSignalR]);

  return (
    <Provider store={store}>
      <AppRouter />
      <ConfirmModal />
      <TreeFolderModal />
      <InfoModal />
      <ErrorModal />
      <ForwardModal />
      <StyledToastContainer autoClose={3000} position="bottom-center" />
    </Provider>
  );
};

export default App;

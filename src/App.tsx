import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Outlet} from "react-router";
import {Link, Stack } from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Stack
              useFlexGap
              flexWrap="nowrap"
              flexDirection='row'
              spacing={2}
              sx={{ alignItems: 'center' }}
          >
              <img src={logo} className="App-logo" alt="logo" />
              <h3>Blog</h3>
          </Stack>

          <Link href="#" underline="none">
              <GitHubIcon />
          </Link>
      </header>
        <Outlet />
    </div>
  );
}

export default App;

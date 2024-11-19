import React from 'react';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
	ErrorPage,
} from '@backstage/core-components';
import { Route } from 'react-router-dom';
import { projectRouteRef } from '../../routes';
import { ProjectPage } from '../ProjectPage';
import { HomePage } from '../HomePage';
import { FlatRoutes } from '@backstage/core-app-api';

export const SynergyPage = () => (
  <Page themeId="tool">
    <Header
      title="Welcome to Synergy!"
      subtitle="Our Inner Source Hub"
    ></Header>
    <Content>
      <ContentHeader title="Inner-Source Projects & Issues">
        <SupportButton>
          This plugin creates an Inner Source dashboard showing all repositories
          needing contributions and more.
        </SupportButton>
      </ContentHeader>
      <FlatRoutes>
				<Route index element={<HomePage />} />
				<Route path={projectRouteRef.path} element={<ProjectPage />} />
				<Route path="*" element={<ErrorPage statusMessage='Page Not Found' />} />
      </FlatRoutes>
    </Content>
  </Page>
);

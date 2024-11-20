import { errorHandler } from '@backstage/backend-common';
import { LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { Request } from 'express';
import { githubProviderImpl } from '../lib/github';
import { Config } from '@backstage/config';
import { DataProviderConfig, readConfig } from '../lib/configReader';
import {
  Project,
  ProjectDetails,
  ProjectIssue,
  SynergyApi,
} from '@jiteshy/backstage-plugin-synergy-common';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
}

type ProjectReq = {
  name: string;
  owner: string;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const providerConfig: DataProviderConfig = readConfig(config);
  const provider = providerConfig.provider;

  let providerImpl: SynergyApi;
  if (provider.toLowerCase() === 'github') {
    providerImpl = await githubProviderImpl(providerConfig);
  } else {
    throw `Provider implementation not found for: ${provider}`;
  }

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/projects', async (_, response) => {
    logger.info(`Fetching inner source projects from ${provider}`);
    const projects: Project[] = await providerImpl.getProjects();
    response.json(projects);
  });

  router.get(
    '/project',
    async (req: Request<{}, {}, {}, ProjectReq>, response) => {
      const { name, owner } = req.query;
      if (name && owner) {
        logger.info(`Fetching inner source project: ${name}`);
        const project: ProjectDetails = await providerImpl.getProject(
          name,
          owner,
        );
        response.json(project);
      } else {
        response
          .status(400)
          .json('Bad request. Please pass name and owner for the project.');
      }
    },
  );

  router.get('/issues', async (_, response) => {
    logger.info(`Fetching inner source issues from ${provider}`);
    const issues: ProjectIssue[] = await providerImpl.getIssues();
    response.json(issues);
  });

  router.get('/myissues', async (_, response) => {
    logger.info(`Fetching user's issues from ${provider}`);
    const issues: ProjectIssue[] = await providerImpl.getMyIssues();
    response.json(issues);
  });

  router.use(errorHandler());
  return router;
}

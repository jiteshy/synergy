import React from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useSynergyApi } from '../../hooks';
import { Box, Grid, makeStyles, Theme } from '@material-ui/core';
import { InfoBanner } from '../InfoBanner';
import { ProjectContributor } from '@jiteshy/backstage-plugin-synergy-common';

const useStyles = makeStyles<Theme>(theme => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.border,
  },
  card: {
    backgroundColor: theme.palette.background.default,
  },
}));

export const Contributions = () => {
  const classes = useStyles();
  const {
    value: contributors,
    loading: contributorsLoading,
    error: contributorsError,
  } = useSynergyApi(api => api.getContributions());

  const {
    value: stats,
    loading: statsLoading,
    error: statsError,
  } = useSynergyApi(api => api.getStats());

  if (contributorsLoading || statsLoading) {
    return <Progress />;
  } else if (contributorsError) {
    return <ResponseErrorPanel error={contributorsError} />;
  } else if (statsError) {
    return <ResponseErrorPanel error={statsError} />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoBanner
          title="Showcasing top contributors"
          subtitle="Recognizing those making an impact through inner-source contributions."
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          className={classes.card}
          title="Inner-Source Stats"
          subheader="Inner-Source projects and issues statistics."
        >
          <Box className={classes.row}>
            <div title="Total no of inner-source projects in your org">
              Inner-Source projects
            </div>
            <div>{stats?.projectsCount}</div>
          </Box>
          <Box className={classes.row}>
            <div title="Total no of pinned issues in inner-source projects">
              Priority (pinned) issues
            </div>
            <div>{stats?.pinnedIssuesCount}</div>
          </Box>
          <Box className={classes.row}>
            <div title="Total no of open issues in inner-source projects">
              Open issues
            </div>
            <div>{stats?.openIssuesCount}</div>
          </Box>
          <Box className={classes.row}>
            <div title="Total no of closed issues so far in inner-source projects">
              Closed issues
            </div>
            <div>{stats?.closedIssuesCount}</div>
          </Box>
          <Box className={classes.row}>
            <div title="Total no of inner-source issues in projects which are not exclusively inner-source">
              Issues not part of inner-source projects
            </div>
            <div>{stats?.standaloneIssuesCount}</div>
          </Box>
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          className={classes.card}
          title="Top Contributors"
          subheader="Inner-Source contributors rankings."
        >
          {contributors?.length ? (
            contributors.map((contributor: ProjectContributor) => (
              <Box className={classes.row}>
                <div>
                  <a
                    href={contributor.url}
                    // className={classes.link}
                    target="_blank"
                  >
                    {contributor.login}
                  </a>
                </div>
                <div>{contributor.contributionsCount}</div>
              </Box>
            ))
          ) : (
            <p>No Inner-Source contributions yet.</p>
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
};

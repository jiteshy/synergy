import React from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useSynergyApi } from '../../hooks';
import { Box, Grid } from '@material-ui/core';
import { InfoBanner } from '../InfoBanner';
import { ProjectContributor } from '@jiteshy/backstage-plugin-synergy-common';

export const Contributions = () => {
  const {
    value: contributors,
    loading,
    error,
  } = useSynergyApi(api => api.getContributions());

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <InfoBanner
          title="Showcasing top contributors"
          subtitle="Recognizing those making an impact through inner-source contributions."
        />
      </Grid>
      <Grid item xs={12} md={6} style={{ margin: 'auto' }}>
        <InfoCard
          title="Top Contributors"
          subheader="Inner-Source contributors rankings."
        >
          {contributors?.length ? (
            contributors.map((contributor: ProjectContributor) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
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

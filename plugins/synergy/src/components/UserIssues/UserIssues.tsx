import React, { useEffect, useState } from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { ProjectIssue } from '@jiteshy/backstage-plugin-synergy-common';
import { useSynergyApi } from '../../hooks';
import { Grid } from '@material-ui/core';
import { IssuesList } from '../IssuesList';
import { InfoBanner } from '../InfoBanner';

export const UserIssues = () => {
  const {
    value: issuesList,
    loading,
    error,
  } = useSynergyApi(api => api.getMyIssues());

  const [openIssues, setOpenIssues] = useState<ProjectIssue[]>([]);
  const [closedIssues, setClosedIssues] = useState<ProjectIssue[]>([]);

  useEffect(() => {
    if (issuesList) {
      const openIssues: ProjectIssue[] = [];
      const closedIssues: ProjectIssue[] = [];
      issuesList.forEach((issue: ProjectIssue) => {
        if (issue.isOpen) {
          openIssues.push(issue);
        } else {
          closedIssues.push(issue);
        }
      });
      setOpenIssues(openIssues);
      setClosedIssues(closedIssues);
    }
  }, [issuesList]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <InfoBanner
          title="Review your contributions so far"
          subtitle="You can view the issues you've closed and those currently assigned to you."
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title="Closed Issues"
          subheader="Inner-Source Issues you have closed so far."
        >
          {closedIssues.length ? (
            <IssuesList issues={closedIssues} />
          ) : (
            <p>No Inner-Source contribution yet.</p>
          )}
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title="Open Issues"
          subheader="Inner-Source Issues you are assigned to."
        >
          {openIssues.length ? (
            <IssuesList issues={openIssues} />
          ) : (
            <p>No Inner-Source issues assigned to you.</p>
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
};

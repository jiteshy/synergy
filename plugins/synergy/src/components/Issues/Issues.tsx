import React, { useEffect, useState } from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { ProjectIssue } from '@jiteshy/backstage-plugin-synergy-common';
import { useSynergyApi } from '../../hooks';
import { Box, Grid } from '@material-ui/core';
import { Dropdown } from '../UI';
import FilterListIcon from '@material-ui/icons/FilterList';
import { IssuesList } from '../IssuesList';
import { InfoBanner } from '../InfoBanner';

export const Issues = () => {
  const {
    value: issuesList,
    loading,
    error,
  } = useSynergyApi(api => api.getIssues());

  const [issues, setIssues] = useState<ProjectIssue[]>([]);
  const [pinnedIssues, setPinnedIssues] = useState<ProjectIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<ProjectIssue[]>([]);
  const [filteredPinnedIssues, setFilteredPinnedIssues] = useState<
    ProjectIssue[]
  >([]);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (issuesList) {
      const issues: ProjectIssue[] = [];
      const pinnedIssues: ProjectIssue[] = [];
      issuesList.forEach((issue: ProjectIssue) => {
        if (issue.isPinned) {
          pinnedIssues.push(issue);
        } else {
          issues.push(issue);
        }
      });
      setIssues(issues);
      setPinnedIssues(pinnedIssues);
      setFilteredIssues(issues);
      setFilteredPinnedIssues(pinnedIssues);
    }
  }, [issuesList]);

  const prepareCategories = (issues?: ProjectIssue[]) => {
    if (!issues) return [];

    const categories = new Set<string>();

    issues.forEach((issue: ProjectIssue) => {
      if (issue.primaryLanguage) {
        categories.add(issue.primaryLanguage);
      }
    });

    return [...categories];
  };

  const filterByCategory = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (issuesList) {
      const currentCategory = e.target.value as string;
      if (currentCategory) {
        const filteredIssues = issues.filter(
          (issue: ProjectIssue) => issue.primaryLanguage === currentCategory,
        );
        const filteredPinnedIssues = pinnedIssues.filter(
          (issue: ProjectIssue) => issue.primaryLanguage === currentCategory,
        );
        setFilteredIssues(filteredIssues);
        setFilteredPinnedIssues(filteredPinnedIssues);
      } else {
        setFilteredIssues(issues);
        setFilteredPinnedIssues(pinnedIssues);
      }
      setCategory(currentCategory);
    }
  };

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Grid container>
      <Grid item xs={12} md={8} lg={10}>
        <InfoBanner
          title="Explore inner-source issues, contribute, and rise on the leaderboard"
          subtitle="Issues below aren’t limited to inner-source projects—any project can request contributions from the inner-source community."
        />
      </Grid>
      <Grid item xs={12} md={4} lg={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gridGap: '8px' }}>
          <FilterListIcon fontSize="medium" style={{ marginTop: '20px' }} />
          <Dropdown
            label="Category"
            items={prepareCategories(issuesList)}
            current={category}
            handleSelect={filterByCategory}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title="Pinned Issues"
          subheader="Pinned issues across repos in your org"
        >
          {filteredPinnedIssues.length ? (
            <IssuesList issues={filteredPinnedIssues} />
          ) : (
            <p>No Pinned Inner-Source issues found.</p>
          )}
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title="Other Issues"
          subheader="Issues across repos in your org (excluding pinned)"
        >
          {filteredIssues.length ? (
            <IssuesList issues={filteredIssues} />
          ) : (
            <p>No Inner-Source issues found.</p>
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
};

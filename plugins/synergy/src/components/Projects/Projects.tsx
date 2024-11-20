import React, { useState } from 'react';
import {
  ItemCardGrid,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { Project } from '@jiteshy/backstage-plugin-synergy-common';
import { useSynergyApi } from '../../hooks';
import { ProjectCard } from '../ProjectCard';
import { Box, Grid } from '@material-ui/core';
import { Dropdown } from '../UI';
import FilterListIcon from '@material-ui/icons/FilterList';

export const Projects = () => {
  const {
    value: projects,
    loading,
    error,
  } = useSynergyApi(api => api.getProjects());

  const [filteredProjects, setFilteredProjects] = useState<Project[]>();
  const [category, setCategory] = useState<string>('');

  const prepareCategories = (projects?: Project[]) => {
    if (!projects) return [];

    const categories = new Set<string>();

    projects.forEach((project: Project) => {
      if (project.primaryLanguage) {
        categories.add(project.primaryLanguage);
      }

      project.topics.forEach((topic: string) => {
        categories.add(topic);
      });
    });

    return [...categories];
  };

  const filterByCategory = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (projects) {
      const currentCategory = e.target.value as string;
      if (currentCategory) {
        const filteredProjects = projects.filter(
          (project: Project) =>
            project.topics.includes(currentCategory) ||
            project.primaryLanguage === currentCategory,
        );
        setFilteredProjects(filteredProjects);
      } else {
        setFilteredProjects(projects);
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
        <div>
          <p>
            Explore the inner-source projects in your organization, contribute,
            and climb the leaderboard!
          </p>
        </div>
      </Grid>
      <Grid item xs={12} md={4} lg={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gridGap: '8px', marginTop: '-14px' }}>
          <FilterListIcon fontSize="medium" style={{ marginTop: '20px' }} />
          <Dropdown
            label="Category"
            items={prepareCategories(projects)}
            current={category}
            handleSelect={filterByCategory}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        {projects?.length ? (
          <ItemCardGrid>
            {(filteredProjects ? filteredProjects : projects).map(
              (project: Project) => (
                <ProjectCard key={project.id} project={project} />
              ),
            )}
          </ItemCardGrid>
        ) : (
          <p>No Inner-Source projects found.</p>
        )}
      </Grid>
    </Grid>
  );
};

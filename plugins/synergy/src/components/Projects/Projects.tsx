import React, { useState } from 'react';
import {
  ItemCardGrid,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { Project } from '@jiteshy/backstage-plugin-synergy-common';
import { useSynergyApi } from '../../hooks';
import { ProjectCard } from '../ProjectCard';
import { makeStyles, Theme } from '@material-ui/core';
import { Dropdown } from '../UI';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles<Theme>(() => ({
  filters: {
    position: 'absolute',
    right: '48px',
    top: '8px',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    width: '10rem',
    zIndex: 1,
  },
  filterIcon: {
    marginTop: '16px',
  },
}));

export const Projects = () => {
  const classes = useStyles();
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
    <>
      <div className={classes.filters}>
        <FilterListIcon className={classes.filterIcon} fontSize="medium" />
        <Dropdown
          label="Category"
          items={prepareCategories(projects)}
          current={category}
          handleSelect={filterByCategory}
        />
      </div>
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
    </>
  );
};

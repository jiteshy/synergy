import React from 'react';
import { ProjectIssue } from '@jiteshy/backstage-plugin-synergy-common';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LinkButton, MarkdownContent } from '@backstage/core-components';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles<Theme>(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    alignItems: 'center',
  },
  infoHeader: {
    backgroundColor: theme.palette.grey['100'],
    marginLeft: '10px',
    marginRight: '10px',
    paddingLeft: '16px !important',
  },
  primary: {
    color: theme.palette.primary.main,
  },
  link: {
    textDecoration: 'underline',
    color: theme.palette.primary.main,
  },
  navigateBtn: {
    marginLeft: 'auto',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
  },
  navigateIcon: {
    paddingLeft: '4px',
  },
}));

export const IssuesList = ({ issues }: { issues: ProjectIssue[] }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('');

  const handleChange =
    (panel: string) => (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : '');
    };

  return issues.map(issue => (
    <Accordion
      key={issue.id}
      expanded={expanded === issue.id}
      onChange={handleChange(issue.id)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{issue.title}</Typography>
        {/* <Typography className={classes.secondaryHeading}>
          Updated On: {issue.updatedAt}
        </Typography> */}
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={12} className={classes.infoHeader}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                gridGap: '1rem',
              }}
              className={classes.secondaryHeading}
            >
              {issue.author && (
                <div>
                  Reporter:{' '}
                  <a
                    href={issue.author?.url}
                    className={classes.link}
                    target="_blank"
                  >
                    {issue.author.login}
                  </a>
                </div>
              )}
              <span>
                Last Updated on:{' '}
                <span>{new Date(issue.updatedAt).toLocaleString()}</span>
              </span>
              <LinkButton
                to={issue.url}
                className={classes.navigateBtn}
                target="_blank"
                variant="contained"
                title="Go to GitHub"
              >
                Contribute{' '}
                <OpenInNewIcon
                  fontSize="small"
                  className={classes.navigateIcon}
                />
              </LinkButton>
            </Box>
          </Grid>
          <Grid item>
            <MarkdownContent content={issue.body} dialect="gfm" />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  ));
};

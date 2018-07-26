import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { PageInfo } from '../Layout';
import { ClientAssessmentHistory, ClientService } from './index';
import Button from '@material-ui/core/Button/Button';
import { CloseableAlert, alertType } from '../common/CloseableAlert';
import { Link } from 'react-router-dom';

import './style.sass';

class Client extends Component {
  constructor(props) {
    super(props);

    const { successClientAddId } = (this.props.location || {}).state || {};
    if (successClientAddId && this.props.history) {
      this.props.history.replace({ ...this.props.location, state: {} });
    }

    const { successClientEditId } = (this.props.location || {}).state || {};
    if (successClientEditId && this.props.history) {
      this.props.history.replace({ ...this.props.location, state: {} });
    }

    this.state = {
      childData: {},
      shouldRenderClientAddMessage: !!successClientAddId,
      shouldRenderClientEditMessage: !!successClientEditId,
    };
  }

  static propTypes = {
    /** React-router match object */
    match: PropTypes.object.isRequired,
    /** React-router location object */
    location: PropTypes.object,
    /** React-router history object */
    history: PropTypes.object,
  };

  componentDidMount() {
    this.fetchChildData(this.props.match.params.id);
  }

  fetchChildData(id) {
    return ClientService.fetch(id)
      .then(data => this.setState({ childData: data }))
      .catch(() => this.setState({ childData: {} }));
  }

  renderClientData(data, label) {
    if (data) {
      return (
        <Grid item xs={6}>
          <Typography variant={'headline'} color={'textSecondary'}>
            {label}
          </Typography>
          {data}
        </Grid>
      );
    }
  }

  formatClientId = num => {
    if (num) {
      if (num.length === 19) {
        const firstFour = num.substring(0, 4);
        const secondFour = num.substring(4, 8);
        const thirdFour = num.substring(8, 12);
        const fourthFour = num.substring(12, 19);
        return `${firstFour}-${secondFour}-${thirdFour}-${fourthFour}`;
      } else if (num.length === 22) {
        return num;
      } else {
        return '0';
      }
    }
  };

  render() {
    const { childData, shouldRenderClientAddMessage, shouldRenderClientEditMessage } = this.state;
    return (
      <Fragment>
        <PageInfo title={'Child/Youth Profile'} />
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card className={'card'}>
              <CardHeader
                className={'card-header-cans'}
                title="Child/Youth Information"
                action={
                  <Link to={`/clients/edit/${childData.id}`}>
                    <Button size="small" color="inherit" className={'card-header-cans-button'}>
                      EDIT
                    </Button>
                  </Link>
                }
              />
              <div className={'content'}>
                <CardContent>
                  {shouldRenderClientAddMessage && (
                    <CloseableAlert
                      type={alertType.SUCCESS}
                      message={'Success! New Child/Youth record has been added.'}
                      isCloseable
                      isAutoCloseable
                    />
                  )}

                  {shouldRenderClientEditMessage && (
                    <CloseableAlert
                      type={alertType.SUCCESS}
                      message={'Success! Child/Youth record has been updated.'}
                      isCloseable
                      isAutoCloseable
                    />
                  )}

                  {childData && childData.id ? (
                    <Grid container spacing={24}>
                      {this.renderClientData(childData.first_name, 'First Name')}
                      {this.renderClientData(childData.last_name, 'Last Name')}
                      {this.renderClientData(childData.dob, 'Birth Date')}
                      {this.renderClientData(childData.case_id, 'Case Number')}
                      {this.renderClientData(this.formatClientId(childData.external_id), 'Client Id')}
                      {this.renderClientData(childData.county.name, 'County')}
                    </Grid>
                  ) : (
                    <span id={'no-data'}>No Child Data Found</span>
                  )}
                </CardContent>
              </div>
            </Card>
          </Grid>
          <ClientAssessmentHistory
            clientId={childData.id}
            location={this.props.location}
            history={this.props.history}
          />
        </Grid>
      </Fragment>
    );
  }
}

export default Client;
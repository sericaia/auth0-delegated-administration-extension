import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';
import { Modal } from 'react-bootstrap';

import { userActions } from '../../../actions';
import { UserForm } from '../../../components/Users';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    userCreate: state.userCreate,
    accessLevel: state.accessLevel,
    connections: state.connections
  });

  static actionsToProps = {
    ...userActions
  }

  static propTypes = {
    accessLevel: PropTypes.object.isRequired,
    connections: PropTypes.object.isRequired,
    userCreate: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
    getDictValue: PropTypes.func.isRequired,
    cancelCreateUser: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userCreate !== this.props.userCreate || nextProps.connections !== this.props.connections || nextProps.accessLevel !== this.props.accessLevel;
  }

  onSubmit = (user) => {
    this.props.createUser(user);
  }

  render() {
    const { error, loading, record } = this.props.userCreate.toJS();
    const connections = this.props.connections.toJS();
    const accessLevel = this.props.accessLevel.get('record').toJS();

    return (
      <Modal show={record !== null} className="modal-overflow-visible" onHide={this.props.cancelCreateUser}>
        <Modal.Header closeButton={loading} className="has-border">
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>

        <UserForm
          connections={connections.records} initialValues={record}
          createMemberships={accessLevel.createMemberships}
          memberships={accessLevel.memberships}
          getDictValue={this.props.getDictValue}
          onClose={this.props.cancelCreateUser}
          onSubmit={this.onSubmit}
        >
          <Error message={error} />
        </UserForm>
      </Modal>
    );
  }
});

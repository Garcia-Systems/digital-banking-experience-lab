import { Component } from "react";
import PropTypes from "prop-types";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <main id="main-content" className="route-page">
          <p className="eyebrow">Unexpected problem</p>
          <h1>This page could not be displayed.</h1>
          <p>
            Other features are still available. Choose another page from the
            member navigation or reload this page to try again.
          </p>
        </main>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

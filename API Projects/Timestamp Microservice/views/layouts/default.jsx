var React = require('react')

class DefaultLayout extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>Timestamp microservice</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
        </head>
        <body>
          {this.props.children}
        </body>
      </html>
    )
  }
}

module.exports = DefaultLayout

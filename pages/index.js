import styles from './index.css';

export default class Index extends React.Component {
  handle() {
    const c = confirm('see you')
    if (c) {
      console.log('yes')
    } else {
      console.log('no')
    }
  }
  render() {
    return (
      <div onClick={this.handle} className='normal'>
        <h1>Page index11</h1>
      </div>
    );
  }
}

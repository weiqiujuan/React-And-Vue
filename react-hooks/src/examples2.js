import React, { useEffect, userState } from "react";
// class example3 extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             count: 0,
//         };
//     }
//     componentDidMount(){
//         console.log()
//     }
//     componentDidUpdate(){
//         console.log()
//     }
//     render() {
//         return (
//             <div>
//                 <p>You click {this.state.count} times</p>
//                 <button onClick={this.addCount.bind(this)}>Click me</button>
//             </div>
//         );
//     }
//     addCount() {
//         this.setState({ count: this.state.count++ });
//     }
// }
function example() {
    let [count, setCount] = userState(0);
    useEffect(() => {
        console.log(`useEffect=> You click ${this.state.count} times`);
        return ()=>{
            console.log('===========================================');
        }
    },[]);
    return (
        <div>
            <p>You click {count} times</p>
            <button
                onClick={() => {
                    setCount(count++);
                }}
            >
                Click me
            </button>
        </div>
    );
}
export default example;

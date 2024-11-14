"use strict";
const a = 1;
let b = "hahah";
var c = [1,2,4]
function test( name ){
  console.log( name )
}
test( b );
export default class VueComponent {
  render(){
    return (
      <div>{console.log(4)}</div>
    )
  }
}
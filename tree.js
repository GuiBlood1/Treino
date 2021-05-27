class Node{
    constructor(data){
        this.data = data
        this.left = null
        this.right = null
    }
}

class BinaryTree {
    constructor () {
        this.root == null
        this.traversal = []
    }
}

breadthFirst () {
    const h = this.getHeight(this.root)
    for(let i = 1 ; i <= h ; i ++){
        this.traverseLevel(this.root,i)
    }
    return this.traversal.toLocaleString()
}

getHeight (node){
    if (nome == null){
        return 0
    }else{
        const lheight = this.getHeight(node.left)
        const rheight = this.getHeight(node.right)
        return lheight > rheight ? lheight + 1 : rheight + 1
    }
}

traverseLevel (node,level){ 
    if (level == 1 ){
        this.traversal.push(node.data)
    }else{   
        if(node == null){
            this.traverseLevel(node.left,level - 1)
            this.traverseLevel(node.right, - 1)
        }

    }
}

const binaryTree = new BinaryTree()
const root = new Node(7)
root.left = new Node (5)
root.right = new Node(8)
root.left.left = new Node(3)
root.left.right = new Node(6)
root.right.right = new Node(9)
binaryTree.root = root

console.log(BinaryTree.breadFirst())
# Mini Project
## Petri Net Design Studio Documentation

The goal of the project was to create a design studio that represents the domain of Petri Nets. A Petri Net has three main components. These components are a definable number of places, transitions, and arcs that connect the two. Here, an arc can be broken down into two types, an in-place, and an out-place. An in-place has a source of a place and destination. Conversely, the outplace has a transition as a source and the place as a destination. Furthermore, a Place also has the attribute of a marking which can be defined as a non-negative integer. These markings represent the number of tokens a place currently has. After defining the markings, we also define a firing process. Firing allows chosen transitions to decrement the number of tokens on all the in places by one and increment the number of tokens for the outplaces by one. 

The Petri Net Design Studio can be applied to many different use cases. One example could be used to model a delivery service processes. You could have an initial and exit places. In between these, could be the different parts of the delivery services life cycle. These could include representing different intermediate places or transitions with payments or different use cases of the customer. Then you could properly connect these with your in-place and out-place arcs.  To represent the movement throughout the different delivery stages, you would initialize the starting place to have a marking of one and every other place to have a marking of zero. Then, you could use the Petri Net “firing” property to move to your next stage. Once, you reached the final place, this could represent a sink, and the package arriving to your customer. Different companies such as Amazon, FedEx, and UPS, could be interested in using these models to represent their supply chain systems. These ideas do not have to be used for transportation however and could similarly applied to other tasks. Some relatable ideas I had was using model to represent college students class schedule. You could add attributes to represent prerequisites class such as a minimum number of tokens. 

Installation Steps:
1)	Install the following:

    a.	Python 

    b.	Git

    c.	NodeJS (LTS recommended)

    d.	MongoDB

    e.	Npm install -g webgme client

2)	Second, start mongodb locally by running the mongod executable in your mongodb installation (you may need to create a data directory or set --dbpath).
3)	Then, run webgme start from the project root to start. Finally, navigate to http://localhost:8888 to start using Petri Nets! 
4)	The Design Studio created for this project is called ‘MiniProject’. 
5)	You can also create your own project and use the Seed created called ‘Petri’.
6)  When using the Seed, you need to enable to plug ing to utilize the interpreter. Below are the steps for this. 
    a.  On the right tool bar, click on Meta
    b.  Under the META dropdown click on validPlugins
    c.  Check the box on 'ModelicaCodeGenerator'
Once, you have installed the design studio, you are ready to start modeling. To begin switch to your composition view (on the left bar) and drag over a PetriNet object. Click on the PetriNet and select the arrow to move inside of hit. Here you, can create our own examples. On the left is the option to drag over places or transitions. You can then connect the transitions by connecting clicking one of them and dragging a line from it to another place or transition. To modify, attributes such as names or markings, click on the object, and use the toolbar on the right. You can also edit, the appearance of objects using the SVG decorator within the right toolbar. For ease, I tried to preset an image that I thought would make sense for most use cases. 
    
After creating a network, our design studio allows you to utilize some helpful functions. The first function that I want to highlight is the built-in interpreter. The interpreter allows users to check if their example Petri Nets are of four types of classifications.  These types of PetriNet classifications are Free Choice, State Machine, Marked Graph, and Workflow Net. To change the goal of the interpreter, modify the init.py file, in the src/plugin folder. The interpreter is attached to the tool bar at the top left (looks like a play button). To use it, first select which example you want to analyze. Then, click the play button on the top left of the tool bar and select the Code Generator, and select ‘Run’. After processing, you will receive four notifications in the bottom right corner of your screen. Each notification corresponds to a type of classification and allows the user to know if their example is of that type. After clicking the notifications, you can erase them by clicking on the trash can icon. Lastly, if you click on the interpreter button and select ‘Show results…’, you can clear previous usages.  


The simulator is an option of the left tool bar. To use this, click on the tab called ‘simulator. The simulator visually preserves the location of the objects from the composition view. To differentiate the transitions that are enabled or not we will use this definition. A transition is enabled if there is a light green link arriving at a transition. From here, the user can click on the selected transition to ‘Fire It’. This moves the marking from one place to the next. If no transition can fire, we color all the transitions yellow. This is used to alert or caution the user that the system is in deadlock. Note, sometimes this does not load right away, you might need to refresh your browser. Furthermore, to reset the state of the machine, use the button on the toolbar that looks like this 


Lastly, if you download the design studio that I created it comes with five examples of Petri Nets. The first two, 'SmallExample1' and 'SmallExample2', are examples to help the user learn the basics of the design studio. Here, the user can easily study the different components such as places, transitions, and arcs. By better understanding these examples, I thought the user could then go and make more complex Petri Nets. 'SmallExample1' is also the example that will come with the new seed. This way new users have a reference. Additionally, the third example is called 'BigExample'. It outlines a possible use case for Petri Nets as it represents a delivery service system. The fourth example is called 'StateMachineExample'. This example was built to help validate our built-in interpreter tool. This can also be used as a resource for a new user to learn more how each component is related. Lastly, the fifth example is called 'Deadlock Example'. This example helps illustrate when a system is in deadlock. 

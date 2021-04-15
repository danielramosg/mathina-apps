	// First create a new element to hold the initial Latex code
	// and eventual MathJax generated SVG. This element isn't added
	// to the main docuemnt, so it's never seen.
let mathBuffer = document.createElement("div");

	// Then define a function that takes LaTeX source code
	// and places the resulting generated SVG in a target SVG element.
mathSVG = function (latex, target) {
	  // Update the buffer with the source latex.
	  mathBuffer.textContent = latex;
	  // Get MathJax to process and typeset.

	  console.log("previous: " , mathBuffer)
	  MathJax.Hub.Queue(["Typeset", MathJax.Hub, mathBuffer]);
	  // Queue a callback function that will execute once it's finished typesetting.
	  
	  MathJax.Hub.Queue(function () {
	  console.log("after: " ,mathBuffer)
		});

	  MathJax.Hub.Queue(function () {
	    // This (svg) is the generated graphics.
	    const svg = mathBuffer.childNodes[1].childNodes[0].childNodes[0];
	    // The next line is optional, play with positioning as you see fit.
	    svg.setAttribute("y", "7pt");
	    // Move the generated svg from the buffer to the target element.
	    target.node().appendChild(svg);
	    // Clear the buffer.
	    //mathBuffer.textContent = "";
	    
	    console.log(svg)

	  });
};




function DragCoefficient (place) {
	this.value = 0

	//this.box = d3.select(place).append("svg").attr("width",50).attr("height",50)
	this.box = place

	this.box.append("rect")
		.attr("width",50).attr("height",30)
		.attr("rx",5)
		.attr("ry",20)
		.attr("fill","yellow")
		.attr("stroke","black");

	this.label = this.box.append("text");

	this.label
		.attr("x",10).attr("y",30)
		.text(this.value);
	 
	this.y0 = 0;
	this.value0 = 0;

	this.testfn = function (){
		console.log(this);
		}

	var This = this;

	this.dragstart = function (){
		This.y0 = d3.event.y;
		This.value0 = This.value;
		}

	this.dragged = function (){
		let y = d3.event.y;
		This.value = This.value0 + (This.y0 - y);
		This.label.text(This.value)
		update()
		}

	this.box.call(d3.drag()
		.on("drag",this.dragged)
		.on("start",this.dragstart) 
		)

}




//coef0 = new DragCoefficient("#controls")
//coef1 = new DragCoefficient("#controls")



function update(){
	coefValues = coefs.map(function (z) {return z.value / 100 });

	F = function (x) {return HornerPolyEval(coefValues,x) }

	Draw(F)
}


function addCoef () {
	var val=parseInt(formula_svg.attr("width"));
	formula_svg.attr("width", val+100)

	var terms = coefs.length;

	var position = formula_svg.append("g")
			.attr("transform", "translate(" + (100*terms+50) + ")" ) 
	
	coefs.push( new DragCoefficient(position) )

	var position2 = formula_svg.append("g")
			.attr("transform", "translate(" + (100*terms + 60+50 ) + ")" ) 

	mathSVG("$$x^{" + terms + "} +$$",position2)


	}


d3.select("#addButton").on("click",addCoef)

function resetCoef () {
	coefs.forEach(function(x) {x.box.remove()})	
	coefs =[];
	formula_svg.html("")
	addCoef()
	update();
	// text.text("$$ x ^2 + x + 1 $$")
	// MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	
	}

d3.select("#resetButton").on("click",resetCoef)


//function F (x) { return x*x }

//coefs = [2,-4,0,1]

function HornerPolyEval (coeffs,x) {
var n = coeffs.length -1;
var i;
var b=0;
for (i=n; i>=0; i--)  { b= b*x + coeffs[i]; }
return b;
}

//Draw(F)


coefs = [];
formula_svg = d3.select("#controls").append("svg").attr("width",500).attr("height",50);
pos = 0;

pos +=5;	
pos_g = formula_svg.append("g")
			.attr("transform", "translate(" + pos + ")" )
			.attr("id","aqui")

mathSVG("$$y=$$",pos_g);
MathJax.Hub.Queue(["Typeset",MathJax.Hub]);


MathJax.Hub.Queue([addCoef])
update()




 // var svg = d3.select("body").append("svg").attr("width",400).attr("height",100)
 // var text = svg.append("foreignObject").attr("width",100).attr("height",100)
 // text.text("$$ x = \\sum_{i \\in A} i^{2} $$")


//MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

































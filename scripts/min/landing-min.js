var pointsArray=document.getElementsByClassName("point"),revealPoints=function(n){n.style.opacity=1,n.style.transform="scaleX(1) translateY(0)",n.style.msTransform="scaleX(1) translateY(0)",n.style.WebkitTransform="scaleX(1) translateY(0)"},animatePoints=function(n){forEach(n,revealPoints)};window.onload=function(){window.innerHeight>950&&animatePoints(pointsArray);var n=document.getElementsByClassName("selling-points")[0],t=n.getBoundingClientRect().top-window.innerHeight+200;window.addEventListener("scroll",function(n){(document.documentElement.scrollTop||document.body.scrollTop>=t)&&animatePoints(pointsArray)})};
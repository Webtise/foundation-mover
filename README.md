# foundation-mover

Moves elements around the DOM based on Foundation breakpoints.

Target elements are appended to the container element.

## Moving an element
- add `data-mover` attribute to container element
- add `data-mover-target="targetElementId:foundationBreakpoint"` attribute to container element

```html
<!-- Target element -->
<img id="image" src="image.jpg" />

<!-- Container element -->
<div class="container" data-mover data-mover-target="image:large;"></div>
```
#### @breakpoint == 'large'
```html
<!-- Container element -->
<div class="container" data-mover data-mover-target="image:large;">
  <!-- Target element -->
  <img id="image" src="image.jpg" />
</div>
```

## Moving an element back
To move an element back and forth you will need two container elements:
```html
<!-- Container element (1) -->
<div class="container-1" data-mover data-mover-target="image:large down;">
  <!-- Target element -->
  <img id="image" src="image.jpg" />
</div>

<!-- Container element (2) -->
<div class="container-2" data-mover data-mover-target="image:large up;"></div>
```
#### @breakpoint <= 'large'
```html
<!-- Container element (1) -->
<div class="container-1" data-mover data-mover-target="image:large down;">
  <!-- Target element -->
  <img id="image" src="image.jpg" />
</div>

<!-- Container element (2) -->
<div class="container-2" data-mover data-mover-target="image:large up;"></div>
```
#### @breakpoint >= 'large'
```html
<!-- Container element (1) -->
<div class="container-1" data-mover data-mover-target="image:large down;"></div>

<!-- Container element (2) -->
<div class="container-2" data-mover data-mover-target="image:large up;">
  <!-- Target element -->
  <img id="image" src="image.jpg" />
</div>
```
## Multiple Target Elements
You can move multiple elements, even at different breakpoints:
```html
<!-- Target element (1) -->
<img id="image" src="image.jpg" />
<!-- Target element (2) -->
<p id="paragraph">This is a pragraph!</p>

<!-- Container element -->
<div class="container" data-mover data-mover-target="image:large; paragraph:xlarge"></div>
```
#### @breakpoint == 'large'
```html
<!-- Target element (2) -->
<p id="paragraph">This is a pragraph!</p>

<!-- Container element -->
<div class="container" data-mover data-mover-target="image:large; paragraph:xlarge">
  <!-- Target element (1) -->
  <img id="image" src="image.jpg" />
</div>
 ```
#### @breakpoint == 'xlarge'
```html
<!-- Container element -->
<div class="container" data-mover data-mover-target="image:large; paragraph:xlarge">
  <!-- Target element (1) -->
  <img id="image" src="image.jpg" />
  
  <!-- Target element (2) -->
  <p id="paragraph">This is a pragraph!</p>
</div>
 ```
## Events
Events are triggered before and after a target is moved:
```javascript
// Example jQuery listener (before target is moved)
$(document).on('before_move.zf.mover', function(event, target) {
  // Do stuff
});
// Example jQuery listener (after target is moved)
$(document).on('after_move.zf.mover', function(event, target) {
  // Do stuff
});
```

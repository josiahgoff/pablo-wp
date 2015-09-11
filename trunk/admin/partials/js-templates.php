<script type="text/html" id="tmpl-pablo-modal">
	<h1>Pablo</h1>
	<div class="pablo-wrap"></div>
</script>

<script type="text/html" id="tmpl-pablo-app">
	<div class="pablo-app-main clearfix"></div>
	<div class="pablo-app-footer clearfix"></div>
</script>

<script type="text/html" id="tmpl-pablo-controls">
	<textarea name="pablo_text" class="pablo-text">{{data.text}}</textarea>
	<p>
		<select class="pablo-font-family-select">
			<option value="serif"<# if ( data.fontFamily == 'serif' ) { #> selected<# } #>>Serif</option>
			<option value="sans-serif"<# if ( data.fontFamily == 'sans-serif' ) { #> selected<# } #>>Sans-Serif</option>
			<option value="cursive"<# if ( data.fontFamily == 'cursive' ) { #> selected<# } #>>Cursive</option>
		</select>
		<select class="pablo-font-size-select">
			<option value="8"<# if ( data.fontSize == 8 ) { #> selected<# } #>>XS</option>
			<option value="10"<# if ( data.fontSize == 10 ) { #> selected<# } #>>Small</option>
			<option value="12"<# if ( data.fontSize == 12 ) { #> selected<# } #>>Medium</option>
			<option value="14"<# if ( data.fontSize == 14 ) { #> selected<# } #>>Large</option>
			<option value="16"<# if ( data.fontSize == 16 ) { #> selected<# } #>>XL</option>
		</select>
		<select class="pablo-font-color-select">
			<option value="rgb(255, 255, 255)"<# if ( data.fontColor == 'rgb(255, 255, 255)' ) { #> selected<# } #>>White</option>
			<option value="rgb(50, 59, 67)"<# if ( data.fontColor == 'rgb(50, 59, 67)' ) { #> selected<# } #>>Black</option>
			<option value="rgb(22, 142, 234)"<# if ( data.fontColor == 'rgb(22, 142, 234)' ) { #> selected<# } #>>Blue</option>
			<option value="rgb(238, 79, 79)"<# if ( data.fontColor == 'rgb(238, 79, 79)' ) { #> selected<# } #>>Red</option>
		</select>
		<select class="pablo-font-style-select">
			'normal', 'bold', 'italic', 'bold italic'
			<option value="normal"<# if ( data.fontStyle == 'normal' ) { #> selected<# } #>>Normal</option>
			<option value="bold"<# if ( data.fontStyle == 'bold' ) { #> selected<# } #>>Bold</option>
			<option value="italic"<# if ( data.fontStyle == 'italic' ) { #> selected<# } #>>Italic</option>
			<option value="bold italic"<# if ( data.fontStyle == 'bold italic' ) { #> selected<# } #>>Bold Italic</option>
		</select>
	</p>
	<div class="pablo-backgrounds-wrap">
		<label class="pablo-background-contrast-label">
			<input type="checkbox"
			       class="pablo-background-contrast"<# if ( data.backgroundContrast ) { #> checked<# } #>></input>
					Contrast
		</label>
		<div class="pablo-backgrounds"></div>
	</div>
</script>

<script type="text/html" id="tmpl-pablo-backgrounds-list-item">
	<img src="{{data.thumb}}" class="pablo-backgrounds-list-item-thumb">
</script>

<script type="text/html" id="tmpl-pablo-actions">
	<button class="button button-primary button-large pablo-button-submit">Insert</button>
	<button class="button button-large pablo-button-cancel">Cancel</button>
</script>
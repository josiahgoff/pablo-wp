<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Pablo
 * @subpackage Pablo/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Pablo
 * @subpackage Pablo/admin
 * @author     Your Name <email@example.com>
 */
class Pablo_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * The settings page screen hook suffix.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $plugin_screen_hook_suffix The screen hook suffix.
	 */
	private $plugin_screen_hook_suffix;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 *
	 * @param      string $plugin_name The name of this plugin.
	 * @param      string $version The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Pablo_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Pablo_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style(
			$this->plugin_name,
			plugin_dir_url( __FILE__ ) . 'css/pablo-admin.css',
			array(),
			$this->version,
			'all'
		);

		// Lightbox
		wp_enqueue_style(
			'magnific-popup',
			plugin_dir_url( __FILE__ ) . 'libs/magnific/magnific-popup.css',
			array(),
			'1.0.0',
			'all'
		);

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Pablo_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Pablo_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script(
			$this->plugin_name,
			plugin_dir_url( __FILE__ ) . 'js/pablo-admin.js',
			array( 'wp-util', 'backbone', 'jquery', 'magnific-popup' ),
			$this->version,
			false
		);

		// Lightbox
		wp_enqueue_script(
			'magnific-popup',
			plugin_dir_url( __FILE__ ) . 'libs/magnific/jquery.magnific-popup.min.js',
			array( 'jquery' ),
			'1.0.0',
			false
		);

	}

	/**
	 * Add an options page under the Settings submenu
	 *
	 * @since  1.0.0
	 */
	public function add_options_page() {

		$this->plugin_screen_hook_suffix = add_options_page(
			__( 'Pablo Settings', $this->plugin_name ),
			__( 'Pablo', $this->plugin_name ),
			'manage_options',
			$this->plugin_name,
			array( $this, 'display_options_page' )
		);

	}

	/**
	 * Render the options page for plugin
	 *
	 * @since  1.0.0
	 */
	public function display_options_page() {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
		}

		include_once 'partials/pablo-admin-display.php';

	}

	public function add_editor_button() {
		echo '<a href="#" id="pablo-button" class="js-pablo-modal button"><span class="smiley-icon"></span> Pablo</a>';
	}

	public function js_templates() {
		include_once 'partials/js-templates.php';
	}

}

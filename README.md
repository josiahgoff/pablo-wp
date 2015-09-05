# Pablo WP

The unofficial Pablo WordPress plugin. Right now it's in prototype phase, sort of a proof of concept of how it would work.

![Pablo Preview Gif](http://i.imgur.com/J1Z93Dg.gif)


## Installation

Create a folder in `wp-content/plugins/` called `pablo-wp` and copy the contents of `trunk` into it. Then log into WordPress and activate the Pablo plugin


## Quick Setup

Want to test out Pablo and work on it? Here's how you can set up your own
local testing environment in a few easy steps:

1. Install [Vagrant](http://vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/).
2. Clone [Chassis](https://github.com/Chassis/Chassis):

   ```bash
   git clone --recursive git@github.com:Chassis/Chassis.git pablo-wp-tester
   ```
   
   If you're getting a `permission denied` error, it probably means you need to set up your [GitHub SSH Key](https://help.github.com/articles/generating-ssh-keys/).

3. Grab a copy of Pablo:

   ```bash
   cd pablo-wp-tester
   mkdir -p content/plugins content/themes
   cp -r wp/wp-content/themes/* content/themes
   git clone git@github.com:josiahgoff/pablo-wp.git pablo-wp
   ```

4. Start the virtual machine:

   ```bash
   vagrant up
   ```

5. Create a symlink and activate the plugin:

   ```bash
   vagrant ssh -c 'cd /vagrant && ln -s /vagrant/pablo-wp/trunk /vagrant/content/plugins/pablo-wp && wp plugin activate pablo-wp'
   ```

6. Sign up at [Avatars.io](http://avatars.io) for free to get your API credentials and input them through the dashboard settings panel.

You're done! You should now have a WordPress site available at
http://vagrant.local.

To access the admin interface, visit http://vagrant.local/wp/wp-admin and log
in with the credentials below:

   ```
   Username: admin
   Password: password
   ```


## Issue Tracking

All tickets for the project are being tracked on [GitHub](https://github.com/josiahgoff/pablo-wp/issues).

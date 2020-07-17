IgniteRealtime.org Website
==========================

About
-----

This is the code that drives the [IgniteRealtime Website](http://igniterealtime.org).

Bug Tracking
------------

Bug tracking is done via [Jira](https://igniterealtime.org/issues/browse/WEB).

Ignite Realtime
===============

[Ignite Realtime] is an Open Source community composed of end-users and developers around the world who 
are interested in applying innovative, open-standards-based Real Time Collaboration to their businesses and organizations. 
We're aimed at disrupting proprietary, non-open standards-based systems and invite you to participate in what's already one 
of the biggest and most active Open Source communities.

[Ignite Realtime]: http://www.igniterealtime.org
[XMPP]: https://xmpp.org/

Testing changes
===============
Run the command
```
mvn package cargo:run
```
to compile the local code and run it as a website on port 8080, and attach a remote debugger to port 5005.

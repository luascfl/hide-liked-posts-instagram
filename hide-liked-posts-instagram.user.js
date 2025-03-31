// ==UserScript==
// @name         Hide Liked Posts on Instagram (With Periodic Scroll Fix)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Hides posts you've liked on instagram.com, scrolling automatically every 2 seconds to ensure the page loads correctly without black screens.
// @author       luascfl
// @match        https://www.instagram.com/*
// @home         https://github.com/luascfl/hide-liked-posts-instagram
// @supportURL   https://github.com/luascfl/hide-liked-posts-instagram/issues
// @updateURL    https://raw.githubusercontent.com/luascfl/hide-liked-posts-instagram/main/hide-liked-posts-instagram.user.js
// @downloadURL  https://raw.githubusercontent.com/luascfl/hide-liked-posts-instagram/main/hide-liked-posts-instagram.user.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide liked posts
    function hideLikedPosts() {
        const posts = document.querySelectorAll('article'); // Select posts
        posts.forEach(post => {
            // Check if the post has a "liked" icon with aria-label="Descurtir"
            const likeIcon = post.querySelector('svg[aria-label="Descurtir"]');
            if (likeIcon && post.style.display !== 'none') {
                post.style.display = 'none'; // Hide the liked post
            }
        });
    }

    // Function to perform a page-down-like scroll and return to the original position
    function performScrollFix() {
        const scrollStep = window.innerHeight * 2; // Double the height of the viewport for 2-page scroll
        const currentScroll = window.scrollY; // Current scroll position

        // Scroll down two "pages" and return
        window.scrollTo(0, currentScroll + scrollStep);
        setTimeout(() => {
            window.scrollTo(0, currentScroll);
        }, 30); // Reduced time to 30ms for faster, imperceptible return
    }

    // Function to observe content dynamically
    function observeContent() {
        const feed = document.querySelector('main'); // Main container for posts
        if (feed) {
            // Observe changes in the main content area
            const observer = new MutationObserver(() => {
                hideLikedPosts();
            });

            observer.observe(feed, { childList: true, subtree: true });
            // Initial run
            hideLikedPosts();
        }
    }

    // Run the observer on page load
    observeContent();

    // Periodic scroll every 2 seconds
    setInterval(() => {
        performScrollFix();
    }, 2000); // 2-second interval
})();

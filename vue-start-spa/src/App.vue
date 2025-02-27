<template>
    <!-- A component has "props" that we pass data to (like parameters in a function) -->
        
    <!-- represents the navbar as a component in app -->
    <navbar
        v-bind:pages="pages"
        v-bind:active-page="activePage"
        :nav-link-click="(index) => activePage = index"
    ></navbar>
    
    <!-- represents the main content as a component in app -->
    <page-viewer 
        v-bind:page="pages[activePage]"
    ></page-viewer>
</template>

<script>
import Navbar from './components/Navbar.vue';
import PageViewer from './components/PageViewer.vue';

export default{
    components: {
        Navbar,
        PageViewer
    },
    data(){
        return{
                // property used to control whether the navbar is in light or dark mode
                //      controlled by the "Toggle Navbar" button
                

                // data property to track the active page
                activePage: 0,
                
                // Creating an array of pages for Vue to iterate through
                pages: [
                {
                    // An array of link info
                    link: {text: 'Home', url: 'index.html'}, 
                    pageTitle: 'Scribblers!',
                    content: 'Welcome to the drawing game Scribblers'
                },
                {
                    // An array of link info
                    link: {text: 'Settings', url: 'settings.html'},
                    pageTitle: 'Settings',
                    content: 'Change your settings'
                }
            ]
        };
    }
}
</script>
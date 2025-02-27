<template>
    <p>simple text</p>
</template>

<script>
export default {

    // Providing data to application

    // This data is not reactive, it's meant to initialize values for the properties
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
    },
}
</script>
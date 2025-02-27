<template>
    <!-- A component has "props" that we pass data to (like parameters in a function) -->
        
    <!-- represents the navbar as a component in app -->
    <navbar
        v-bind:pages="pages"
        v-bind:active-page="activePage"
        :nav-link-click="(index) => activePage = index"
    ></navbar>

    <!-- v-show is a CSS solution to HIDING content -->
    <div v-show="false"> hide this</div> 
    
    <!-- represents the main content as a component in app -->
    <!--    v-if is a way to NOT PRESENT the content at all -->
    <!-- <page-viewer 
        v-if="pages.length > 0"
        v-bind:page="pages[activePage]"
    ></page-viewer> -->

    <create-page
        v-bind:page-created="pageCreated"
    ></create-page>

</template>

<script>
import Navbar from './components/Navbar.vue';
import PageViewer from './components/PageViewer.vue';
import CreatePage from './components/CreatePage.vue';

export default{
    components: {
        Navbar,
        PageViewer,
        CreatePage
    },

    created(){
        this.getPages();
    },

    data(){
        return{
            // property used to control whether the navbar is in light or dark mode
            //      controlled by the "Toggle Navbar" button
            

            // data property to track the active page
            activePage: 0,
            
            // Creating an array of pages for Vue to iterate through for the pages in the navbar
            pages: [] // this array is empty for a brief moment so we need an "empty" checker before displaying it
        };
    },
    methods :{
        // pages we want to dynamically load, i.e. fetching server data
        async getPages() {
            // fetching json file from "public" folder
            let res = await fetch('pages.json');
            // parse the json file
            let data = await res.json();

            this.pages = data;
        },
        pageCreated(pageObj){
            console.log(pageObj);
        }
    }
}
</script>
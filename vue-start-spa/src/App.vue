<template>
    <!-- A component has "props" that we pass data to (like parameters in a function) -->
        
    <!-- represents the navbar as a component in app -->
    <navbar
        v-bind:pages="pages"
        v-bind:active-page="activePage"
    ></navbar>

    <router-view>
        
    </router-view>

    <!-- v-show is a CSS solution to HIDING content -->
    <!-- <div v-show="false"> hide this</div>  -->
    
    <!-- represents the main content as a component in app -->
    <!--    v-if is a way to NOT PRESENT the content at all -->
    <!-- <page-viewer 
        v-if="pages.length > 0"
        v-bind:page="pages[activePage]"
    ></page-viewer> -->
<!-- 
    <create-page
        v-on:page-created="pageCreated"
    ></create-page> -->

    <!-- Toggle button for AAC Board -->
    <button class="toggle-button" @click="showAacBoard = !showAacBoard">
        {{ ShowAacBoard ? "Close AAC Board" : "Open AAC Board" }}
    </button>

    <!-- AAC Board Component -->
    <aac-board v-if="showAacBoard"></aac-board>
</template>

<script>
import Navbar from './components/Navbar.vue';
import PageViewer from './components/PageViewer.vue';
import CreatePage from './components/CreatePage.vue';
import AacBoard from './components/aacBoard.vue';

export default{
    components: {
        Navbar,
        PageViewer,
        CreatePage,
        AacBoard
    },

    created(){
        this.getPages();

        this.$bus.$on('navbarLinkActivated', (index) => {
            this.activePage = index;
        });
    },

    data(){
        return{
            // property used to control whether the navbar is in light or dark mode
            //      controlled by the "Toggle Navbar" button
            

            // data property to track the active page
            activePage: 0,
            
            // Creating an array of pages for Vue to iterate through for the pages in the navbar
            pages: [], // this array is empty for a brief moment so we need an "empty" checker before displaying it

            //Property to track AAC Board visibility
            showAacBoard: false
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
            // any data a user enters will mutate an array that handles the pages
            this.pages.push(pageObj);
        }
    }
}
</script>

<style>
/* Style for the toggle button */
.toggle-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.toggle-button:hover {
    background-color: #0056b3;
}
</style>
<template>
    <!-- Creating a navbar using Vue -->

    <!-- HTML array of Bootstrap CSS navbar classes, controlled by a property (theme) created in Vue.js script to control light/dark navbar mode -->
    <nav v-bind:class="[`navbar-${theme}`, `bg-${theme}`, 'navbar', 'navbar-expand-lg']">  
        <div class="container-fluid"> <!-- Bootstrap -->
            <a class="navbar-brand" href="#"> Scribblers </a> <!-- Bootstrap -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row align-items-center mt-2"> <!-- Bootstrap -->
                <!-- Integrating Vue -->
                <!-- Vue uses a for loop defined by "v-for"
                        It will work with every "link" and "index" in the "links" array that we defined in our scripts
                -->
                <!-- Using "v-bind:key" or ":key" helps Vue properly associated objects in our array when they are updated -->
                <li v-for="(page, index) in pages" class="nav-item mx-3" v-bind:key="index">

                    <navbar-link
                        v-bind:page="page"
                        v-bind:isActive="activePage == index"
                        v-on:click.prevent="navLinkClick(index)"
                    ></navbar-link>
                </li>
            </ul>
            <form class="d-flex">
                <!-- Toggles the action of the dark/light mode for navbar -->
                <button 
                    class="btn btn-primary"
                    v-on:click.prevent="changeTheme()"
                >Toggle Navbar</button>
            </form>
        </div>
    </nav>
</template>

<script>
import NavbarLink from './NavbarLink.vue';
export default {
    components:{
        NavbarLink
    },
    created() {
        this.getThemeSetting();
    },
    props: ['pages', 'activePage', 'navLinkClick'],
    data(){
        return{
            theme: 'dark',
        }
        
    },
    // methods to be used 
    methods: {
        // used in the "Toggle Button" button
        changeTheme() {
            // variable local to changeTheme
            let theme = 'light';

            // if our "theme" property (this.them) is set to light, 
            // change the local "theme" to dark
            if(this.theme == 'light'){
                theme = 'dark';
            } 

            // set our property to the local variable
            this.theme = theme;
            this.storeThemeSetting();
        },
        storeThemeSetting(){
            localStorage.setItem('theme', this.theme);
        },
        getThemeSetting(){
            let theme = localStorage.getItem('theme');

            if (theme) {
                this.theme = theme;
            }
        }
    }
}
</script>
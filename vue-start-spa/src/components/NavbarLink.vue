<template>
    <!-- Using the "link" array created in the Vue script -->
    <!-- using v-bind with attributes signals Vue to a specified field for the objects we made in the script
        note: you can use "v-bind:" or just ":"
    -->
    <!-- "active: activePage == index" will make the name of the tab the user is on more apparent-->
    <!-- Replacing the text in {{ }} with link.text signals Vue to iterate through the array and use the "text" field-->
    <!-- We use "v-on:click" to create an event associated with a mouse
        ".prevent" is used to prevent the user from navigating to the href (i assume it's for testing)
    -->
    <a 
        class="nav-link" 
        v-bind:class="activeClasses"
        aria-current="page" 
        v-bind:href="page.link.url"
        :title="`This goes to the ${page.link.text} page`"

    >{{ page.link.text }}</a>
</template>

<script>

export default{
    props: ['page', 'isActive'],
    computed: {
        activeClasses(){
            return{
                active: this.isActive,
                emphasize: this.isActive
            };
        }
    }
}
</script>

<style scoped>
.emphasize{
    text-decoration: underline !important;
}
</style>
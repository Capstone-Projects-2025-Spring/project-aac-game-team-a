<template>
    <!-- This is our template to be used by Vue.creatApp() to generate content-->
    <div class="container">
        <h1 class="emphasize">Page Title</h1>
        <p>Content</p>
    </div>  
</template>

<script>
export default {
    props: {
        page : {
            type: Object,
            default(rawProps){
                return{
                    pageTitle: '',
                    content: ''
                };
            }
        }
    }
}
</script>

<style scoped>
.emphasize{
    color: rgb(122, 100, 71)
}
</style>
<template>
    <!-- This is our template to be used by Vue.creatApp() to generate content-->
    <div class="container">
        <h1 class="emphasize">Page Title</h1>
        <p>{{$route.params.index}}</p>
    </div>  
</template>

<script>
export default {
    created() {
        //console.log(this.$route.params);

    }
}
</script>

<style scoped>
.emphasize{
    color: rgb(122, 100, 71)
}
</style>
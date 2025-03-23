<script>
// Importing RouterLink from vue-router to enable navigation within the app

export default {
    data() {
        return {
            currentUser: "", // Stores the username entered by the user
            currentUserAvatar: "", // Stores the avatar selected by the user
            // List of avatar selection buttons with corresponding images and labels 
            // (images are referenced in 'public' directory)
            landingPageButtons: [
                {id: 1, imgSrc: 'lion.png', label: 'Lion'},
                {id: 2, imgSrc: 'tiger.webp', label: 'Tiger'},
                {id: 3, imgSrc: 'bear.png', label: 'Bear'}
            ],
        };
    },
    methods: {
    },
    name: "AvatarSelect",
};
</script>

<template>
    <div class="avatar-select-screen">
        <!-- Page title prompting user to choose an avatar -->
        <p class="choose-avatar">Choose your avatar!</p>
        <div>
            <div class="avatar-container">
                <!-- Loops through the avatar selection buttons and displays them -->
                <!-- Clicking a button sets the avatar and username, then navigates to the game page -->
                <RouterLink 
                    :to="{
                        path: '/game', // Navigates to the game route
                        query: { user: button.label, avatar: button.imgSrc} // Passes selected user data as query params
                    }"
                    v-for="(button, index) in landingPageButtons" 
                    :key="index" 
                    class="avatar-buttons"
                >
                    <img :src="button.imgSrc" :alt="button.label" class="button-image"/>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1024px){
    .avatar-select-screen{
        /* display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center;     
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); 
        width: 100%;
        height: 100vh;     */
        
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: center;
    }
    

    .title {
        text-align: center;
        margin-bottom: 0px; /* Adds some space between the title and choose string */
        font-size: 50px;
    }

    .choose-avatar {
        text-align: center;
        margin-bottom: 20px; /* Adds some space between the string and buttons */
        font-size: 30px;
    }

    .avatar-container {
        display: flex;
        flex-direction: row; /* Stack buttons vertically */
        align-items: center;    /* Center buttons horizontally */
    }

    .avatar-buttons {
        margin: 10px; /* Adds space between buttons */
        background: none;
        border: none;
        padding: 10px;
        cursor: pointer;
    }

    .button-image {
        width: 50px; /* Adjust the image size */
        height: 50px;
        object-fit: cover;
    }
}
</style>
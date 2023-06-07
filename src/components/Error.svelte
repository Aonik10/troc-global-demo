<script lang="ts">
    const image = new URL("../../static/error.png", import.meta.url).href

    export let error: string;
</script>

<div class="error-component">
    <img src={image} alt="error" class="error-img">
    <p>{error}</p>
</div>

<style>
    .error-img {
        width: 130px;
        filter: invert(72%) sepia(100%) saturate(611%) hue-rotate(335deg) brightness(99%) contrast(90%);
    }

    p {
        color: rgb(240, 173, 48)
    }
</style>
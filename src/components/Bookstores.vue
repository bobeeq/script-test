<template>
  Empik, Tantis, Gandalf, Bonito...
</template>

<script>
export default {
  name: 'HelloWorld',
  mounted() {
    const confirm = prompt('Działamy?');

    if(confirm) {
      fetch('https://classic.bonito.pl/', {credentials: 'include', mode: 'cors'}).then(res => res.text()).then(console.log);
    }
  }
}
</script>

<style scoped>

</style>

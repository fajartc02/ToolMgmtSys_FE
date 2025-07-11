<template>
  <div class="pa-4">
    <v-label class="mb-2">Pilih Jam:</v-label>
    <v-time-picker
      v-model="selectedTime"
      format="24hr"
      color="primary"
      elevation="2"
    ></v-time-picker>

    <v-alert type="info" class="mt-4" border="start" colored-border>
      <strong>Jam dipilih:</strong> {{ selectedTime }}
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'OnlyTimePicker',
  data() {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return {
      selectedTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    }
  },
}
</script>

<style scoped>
.v-label {
  font-weight: 600;
  font-size: 14px;
}
</style>

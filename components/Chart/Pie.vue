<template>
  <Pie
    id="my-chart-id"
    :chart-options="chartOptions"
    :chart-data="chartData"
    style="height: 350px; width: 350px;"
  />
</template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default {
  name: 'PieChart',
  components: { Pie },
  props: {
    tasks: {
      type: Array,
      default: () => []
    },
    type: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chartOptions: {
        responsive: true
      }
    }
  },
  computed: {
    chartData () {
      const dataTask = this.type.map((value) => {
        const tasksFilter = this.tasks.filter(task => task?.type?.id === value.id || (value.name === 'Pending' && !task.type))
        return tasksFilter.length
      })
      const labels = this.type.map(value => value.name)
      return {
        labels,
        datasets: [{
          data: [...dataTask],
          backgroundColor: [
            '#00E676',
            '#FFC107',
            '#00E676',
            '#7C3AED',
            '#B5B5B5'
          ],
          hoverOffset: 4
        }]
      }
    }
  },
  mounted () {

  }
}
</script>

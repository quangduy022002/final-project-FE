<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    style="height: 350px; width: 350px;"
  />
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement
)

export default {
  name: 'LineChartComponent',
  components: { Bar },
  props: {
    tasks: {
      type: Array,
      default: () => []
    },
    priority: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chartOptions: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }
  },
  computed: {
    chartData () {
      let labels = this.priority.map(value => value.name)
      labels = [...labels, 'Non Priority']
      let data = this.priority.map((value) => {
        const tasksFilter = this.tasks.filter(task => task?.priority?.id === value.id)
        return tasksFilter.length
      })
      const nonPriority = this.tasks.filter(task => task.priority === null)
      data = [...data, nonPriority.length]
      return {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            '#B5B5B5'
          ],
          hoverOffset: 4
        }]
      }
    }
  }
}
</script>

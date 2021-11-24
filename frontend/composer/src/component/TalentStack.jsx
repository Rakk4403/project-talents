import PropTypes from 'prop-types'

function TalentStack(props) {
  const talentMap = {};
      props.talents.forEach((talent) => {
      if (talentMap[talent]) {
        talentMap[talent] = talentMap[talent] + 1
      } else {
        talentMap[talent] = 1
      }
    })

  const sortedList = Object.keys(talentMap)
    .map((key) => [key, talentMap[key]])
    .sort((a, b) => a[1] < b[1] ? 1 : -1);

  return (
    <div style={{ ...props.style }}>
      {sortedList.map((item) => {
        return (
          <div key={item[0]}>{item[0]} : {item[1]}</div>
        );
      })}
    </div>
  )
}

TalentStack.propTypes = {
  style: PropTypes.object,
  talents: PropTypes.arrayOf(PropTypes.string),
}

export default TalentStack;